// tasks.model.ts
export interface Task {
  id: number;
  title: string;
  status: 'Pending' | 'Completed';
  created: Date;
  memberId: number;
}
