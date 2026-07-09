import { TESTING_EMAILS } from '@/constants/definitions';

export const isTestingEmail = (email: string) => {
    return TESTING_EMAILS.split(',').includes(email);
};
