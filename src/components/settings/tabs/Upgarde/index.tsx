import ActivePlan from './ActivePlan';
import AllCredicts from './AllCredicts';
import AllPlans from './AllPlans';
import { queryClient } from '@/config/query.config';

const Upgrade = () => {
    const activeSubscription = queryClient.getQueryData<ActiveSubscription>([
        'active_subscription',
    ]) as ActiveSubscription;

    console.log('activeSubscription', activeSubscription);

    return (
        <div className='flex flex-col gap-5 w-full overflow-y-auto h-full'>
            <ActivePlan activeSubscription={activeSubscription} />
            <AllCredicts activeSubscription={activeSubscription} />
            <AllPlans />
        </div>
    );
};

export default Upgrade;
