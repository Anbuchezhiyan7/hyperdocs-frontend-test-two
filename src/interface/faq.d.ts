interface FAQ {
    faq_id?: string;
    faq_data: FAQItem[];
}

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQElementAttributes {
    faq: FAQ;
    isEditing?: boolean;
}

type FAQUpdateHandler = (faqId: string, updatedFAQ: Partial<FAQ>) => Promise<void>;
