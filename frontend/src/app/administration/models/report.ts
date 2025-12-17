import { Issue } from './issue';

export interface Report {
  id: number;
  issue?: Issue | null;
  created: string;
}
