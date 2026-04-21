// Root page — renders the smokedope2016 character archive at beadoz.dev
import { smokedope } from '@/data/characters/smokedope';
import { CharacterPage } from '@/components/characters/CharacterPage';

export default function Home() {
  return <CharacterPage config={smokedope} />;
}
