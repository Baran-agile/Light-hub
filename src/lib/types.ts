export interface Light {
  id: string;
  name: string;
  status: 'on' | 'off';
}

export type IconName = 'BookOpen' | 'Film' | 'PartyPopper' | 'Tv';

export interface Scene {
  id: string;
  name: string;
  icon: IconName;
  description: string;
  lightStates: { lightId: string; status: 'on' | 'off' }[];
}

export interface Environment {
  temperature: number;
  humidity: number;
}
