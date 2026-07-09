import { useAuth } from '@/providers/auth.provider';
import ImageInput from '../../Advanced/elements/ImageInput';
import { Input } from '@/components/common/Input';

type ProfileType = {
    name: string;
    email: string;
    onChange: (name: string, value: any) => void;
    logo: string;
    errors: any;
};

const Profile = ({ name, email, onChange, logo, errors }: ProfileType) => {
    const { user } = useAuth();
    console.log('USER', user);
    console.log('ERRORS', errors);
    const imageSource =
        typeof logo === 'string'
            ? {
                  url: logo,
              }
            : logo || user?.picture;
    return (
        <div className='flex flex-col gap-6 border-b border-[#E0E0E0] pb-4'>
            <div className='flex gap-4 items-center'>
                <div className='border-none overflow-hidden w-fit pr-4'>
                    <ImageInput
                        name='organization_logo'
                        value={imageSource}
                        inputClassName='!rounded-full'
                        inputContainerClassName='!border-none'
                        onChange={value =>
                            onChange('organization_logo', value?.url ? value?.url : value)
                        }
                        inputType='image'
                        error={errors?.organization_logo?.message}
                    />
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <Input
                        name='organization_name'
                        value={name}
                        inputClassName='w-full'
                        label='Preferred Name'
                        inputType='text'
                        placeholder='Enter your preferred name'
                        onChange={value => onChange('organization_name', value as string)}
                        error={errors?.organization_name?.message}
                        required
                    />
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-2 items-start'>
                    <p className='text-sm font-medium text-[#333]'>Email</p>
                    <p className='text-sm font-medium text-[#8F8F8F]'>{email}</p>
                </div>
                {/* <div>
                    <Button className="h-[32px]">Change Email</Button>
                </div> */}
            </div>
        </div>
    );
};

export default Profile;
