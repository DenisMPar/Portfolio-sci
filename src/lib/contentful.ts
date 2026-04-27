import { createClient } from "contentful";
import type { EntrySkeletonType, EntryFieldTypes } from "contentful";
import type {
  Project,
  ShowcaseProject,
  CaseStudyProject,
  CaseStudySection,
} from "@/data/projects";

interface ProjectFields {
  title: EntryFieldTypes.Text;
  slug: EntryFieldTypes.Text;
  description: EntryFieldTypes.RichText;
  type: EntryFieldTypes.Text;
  tags: EntryFieldTypes.Object;
  year: EntryFieldTypes.Integer;
  role: EntryFieldTypes.Text;
  status: EntryFieldTypes.Text;
  liveUrl?: EntryFieldTypes.Text;
  repoUrl?: EntryFieldTypes.Text;
  caseStudySections?: EntryFieldTypes.Object;
  order: EntryFieldTypes.Integer;
  images?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
}

interface ProjectSkeleton extends EntrySkeletonType {
  contentTypeId: "project";
  fields: ProjectFields;
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

function richTextToPlain(doc: unknown): string {
  const node = doc as {
    content?: Array<{ content?: Array<{ value?: string }> }>;
  };
  if (!node.content) return "";
  return node.content
    .flatMap(
      (block) => block.content?.map((inline) => inline.value ?? "") ?? [],
    )
    .join(" ")
    .trim();
}

type AssetShape = { fields: { file: { url: string } } };

function assetUrl(asset: unknown): string {
  const a = asset as AssetShape;
  return `https:${a.fields.file.url}`;
}

export async function getProjects(): Promise<Project[]> {
  const entries = await client.getEntries<ProjectSkeleton>({
    content_type: "project",
    order: ["fields.order"],
  });

  return entries.items.map((item) => {
    const f = item.fields;

    const base = {
      slug: f.slug as unknown as string,
      title: f.title as unknown as string,
      description: richTextToPlain(f.description),
      tags: f.tags as unknown as string[],
      year: f.year as unknown as number,
      role: f.role as unknown as Project["role"],
      status: f.status as unknown as Project["status"],
      liveUrl: (f.liveUrl as unknown as string) || undefined,
      repoUrl: (f.repoUrl as unknown as string) || undefined,
    };

    const type = f.type as unknown as string;

    if (type === "case-study") {
      const raw = f.caseStudySections as unknown as {
        sections: CaseStudySection[];
      };
      return {
        ...base,
        type: "case-study" as const,
        sections: raw?.sections ?? [],
      } satisfies CaseStudyProject;
    }

    const rawImages = (f.images as unknown as AssetShape[] | undefined) ?? [];
    return {
      ...base,
      type: "showcase" as const,
      images: rawImages.map(assetUrl),
    } satisfies ShowcaseProject;
  });
}
