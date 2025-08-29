interface Report {
  id: number;
  status: 'pending' | 'reviewed';
  reason: string;
  reporterId: number;
  createdAt: string;
}
