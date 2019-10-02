import { News } from './news';

export interface Source {
    id: string;
    news: News[];
}