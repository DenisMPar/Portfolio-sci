import { createClient } from "contentful";
import type { EntrySkeletonType, EntryFieldTypes } from "contentful";
import type { Project } from "@/data/projects";

interface ProjectFields {
  proyectTitle: EntryFieldTypes.Text;
  proyectDescription: EntryFieldTypes.RichText;
  proyectPreviewImg: EntryFieldTypes.AssetLink;
  webLink?: EntryFieldTypes.Text;
  gitHubLink?: EntryFieldTypes.Text;
  techs: EntryFieldTypes.Object;
  imgMovil?: EntryFieldTypes.AssetLink;
  imgMedium?: EntryFieldTypes.AssetLink;
  proyectType?: EntryFieldTypes.Text;
}

interface ProjectSkeleton extends EntrySkeletonType {
  contentTypeId: "proyect";
  fields: ProjectFields;
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

function richTextToPlain(doc: unknown): string {
  const node = doc as { content?: Array<{ content?: Array<{ value?: string }> }> };
  if (!node.content) return "";
  return node.content
    .flatMap((block) => block.content?.map((inline) => inline.value ?? "") ?? [])
    .join(" ")
    .trim();
}

export async function getProjects(): Promise<Project[]> {
  const entries = await client.getEntries<ProjectSkeleton>({
    content_type: "proyect",
    order: ["-sys.createdAt"],
  });

  return entries.items.map((item) => {
    const fields = item.fields;

    const title = fields.proyectTitle as unknown as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const thumbnail = fields.proyectPreviewImg as unknown as {
      fields: { file: { url: string } };
    };

    const techs = fields.techs as unknown as Record<string, string>;
    const tags = Object.values(techs);

    return {
      slug,
      title,
      description: richTextToPlain(fields.proyectDescription),
      thumbnail: `https:${thumbnail.fields.file.url}`,
      tags,
      liveUrl: (fields.webLink as unknown as string) || undefined,
      repoUrl: (fields.gitHubLink as unknown as string) || undefined,
    };
  });
}
