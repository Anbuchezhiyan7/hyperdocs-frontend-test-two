type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type CenteredModalProps = ModalProps & {
    children: React.ReactNode;
    title?: string;
    height?: number | string;
    width?: number | string;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    hideCloseIcon?: boolean;
    hideHeader?: boolean;
    hideFooter?: boolean;
    maskClassName?: string;
    contentClassName?: string;
    rootClassName?: string;
    childrenClassName?: string;
    headerClassName?: string;
    footerClassName?: string;
    defaultFooterClassName?: string;
    footerSecBtnLabel?: string;
    footerPriBtnLabel?: string;
};

type FloatingModalProps = {
    onSave?: () => void;
    icon?: React.ReactNode;
    btnLabel?: string;
    title?: string;
    children: React.ReactNode;
    primayBtnLabel?: string;
    secondaryBtnLabel?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    hideHeader?: boolean;
    hideFooter?: boolean;
    btnClassName?: string;
    rootClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    titleClassName?: string;
    onClose?: () => void;
};
