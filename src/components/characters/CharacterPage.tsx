// Dispatcher — routes a CharacterConfig to the correct page component by slug.
import type { CharacterConfig } from '@/lib/types';
import { SmokePage } from './smokedope/SmokePage';

type Props = {
  config: CharacterConfig;
};

type PageComponent = (props: Props) => React.ReactElement;

const pageMap: Record<string, PageComponent> = {
  smokedope2016: SmokePage,
};

export function CharacterPage({ config }: Props) {
  const Page = pageMap[config.slug];
  if (!Page) return null;
  return <Page config={config} />;
}
