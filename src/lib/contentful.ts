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
  year?: EntryFieldTypes.Integer;
  status?: EntryFieldTypes.Text;
  order?: EntryFieldTypes.Integer;
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
    order: ["fields.order"],
  });

  return entries.items.map((item) => {
    const fields = item.fields;

    const title = fields.proyectTitle as unknown as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    type AssetShape = { fields: { file: { url: string } } };

    const thumbnail = fields.proyectPreviewImg as unknown as AssetShape;
    const imgMovil = fields.imgMovil as unknown as AssetShape | undefined;
    const imgMedium = fields.imgMedium as unknown as AssetShape | undefined;

    const thumbUrl = `https:${thumbnail.fields.file.url}`;
    const movilUrl = imgMovil ? `https:${imgMovil.fields.file.url}` : thumbUrl;
    const mediumUrl = imgMedium ? `https:${imgMedium.fields.file.url}` : thumbUrl;

    const techs = fields.techs as unknown as Record<string, string>;
    const tags = Object.values(techs);

    return {
      slug,
      title,
      description: richTextToPlain(fields.proyectDescription),
      thumbnail: thumbUrl,
      imgMovil: imgMovil ? movilUrl : undefined,
      imgMedium: imgMedium ? mediumUrl : undefined,
      tags,
      year: fields.year as unknown as number,
      role: (fields.proyectType as unknown as string) as Project["role"],
      status: (fields.status as unknown as string) as Project["status"],
      liveUrl: (fields.webLink as unknown as string) || undefined,
      repoUrl: (fields.gitHubLink as unknown as string) || undefined,
    };
  });
}
