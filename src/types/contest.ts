
// src/types/contest.ts
export interface ContestProps {
    id: string;
    title: string;
    platform: string;
    description:string;
    startTime: Date;
    endTime: Date;
    url:string;
    bookmarked:boolean;
    reminder:boolean;
    note:string;
    solutionUrl:string;
  }
  