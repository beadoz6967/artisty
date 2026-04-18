// Dynamic character route — looks up config by slug, 404s if not found.
import { notFound } from 'next/navigation';
import { smokedope } from '@/data/characters/smokedope';
import { daredevil } from '@/data/characters/daredevil';
import { CharacterPage } from '@/components/characters/CharacterPage';
import type { CharacterConfig } from '@/lib/types';

const configs: Record<string, CharacterConfig> = {
  smokedope2016: smokedope,
  daredevil: daredevil,
};

type Props = {
  params: Promise<{ character: string }>;
};

export default async function CharacterRoute({ params }: Props) {
  const { character } = await params;
  const config = configs[character];
  if (!config) notFound();
  return <CharacterPage config={config} />;
}

export function generateStaticParams() {
  return Object.keys(configs).map((slug) => ({ character: slug }));
}
