import { auth } from '@/auth';
import { currentUser } from '@/lib/auth';
import { fetchLeaveData } from './_data/fetchdata';


export default async function DashboardPage() {
  const session = await auth();
  const user = await currentUser();

  if (!session || !user) {
    return <p className='flex flex-col items-center justify-center text-center'>Unauthorized access.</p>;
  }

  if (session.user.role !== 'Administrator') {
    return <p className='flex flex-col items-center justify-center text-center'>Unauthorized access.</p>;
  }

  const leaves = await fetchLeaveData(user.id);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in User Info</p>
      <p>ID: {user.id}</p>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      <h1 className='mt-8'>Leaves</h1>

      <ul>
        {leaves.map(leave => (
          <li key={leave.id}>{leave.startDate} {leave.endDate} {leave.reason}</li>
        ))}
      </ul>
    </div>
  );
}