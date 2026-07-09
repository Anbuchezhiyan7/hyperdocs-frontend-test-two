import FileUploader from '@/components/common/Input/Upload';
import { PlateEditor } from '@udecode/plate/react';

/**
 * Field definitions for the lead magnet form.
 * Used to render the main fields for creating or editing a lead magnet.
 */
export const leadMagnetFormFields = [
    {
        name: 'title',
        label: 'Title',
        placeholder: 'Enter lead magnet title',
        type: 'text',
        required: true,
    },
    {
        name: 'description',
        label: 'Description',
        placeholder: 'Enter lead magnet description',
        type: 'textarea',
        required: true,
    },
];

/**
 * Input definitions for the lead magnet details form.
 * Includes title, image upload, description, CTA button, and required details checkboxes.
 */
export const detailsInputs = [
    {
        name: 'title',
        label: 'Title',
        placeholder: 'Enter lead magnet title',
        type: 'text',
        required: true,
        className: 'w-[48%]',
    },
    {
        name: 'image_url',
        label: 'Upload Image',
        type: 'upload',
        component: FileUploader,
        className: 'w-[48%]',
        accept: 'image/*',
        hideBorder: true,
        resetHeight: true,
        buttonText: 'Upload Image',
        defaultText: '',
        baseInputClassName: 'w-[48%] !justify-start',
    },
    {
        name: 'description',
        label: 'Description',
        placeholder: 'Enter lead magnet description',
        type: 'textarea',
        required: true,
        className: 'w-full',
    },
    {
        name: 'cta_button',
        label: 'CTA Button',
        placeholder: 'Enter CTA button text',
        type: 'text',
        required: true,
        className: 'w-[48%]',
    },
    {
        name: 'details_required',
        label: 'Details Required',
        placeholder: 'Enter details required',
        type: 'checkbox',
        required: true,
        className: 'w-[48%]',
        options: [
            {
                label: 'Name',
                value: 'name',
            },
            {
                label: 'Email',
                value: 'email',
            },
            {
                label: 'Phone',
                value: 'phone',
            },
        ],
    },
];

/**
 * Input definitions for the newsletter details form.
 */
export const newsletterInputs = [
    {
        name: 'title',
        label: 'Title',
        placeholder: 'Subscribe to Newsletter',
        type: 'text',
        required: true,
        className: 'w-[48%]',
    },
    {
        name: 'description',
        label: 'Description',
        placeholder: 'Stay up to date with our latest news',
        type: 'textarea',
        required: true,
        className: 'w-[48%]',
    },
    {
        name: 'cta_button',
        label: 'CTA Button',
        placeholder: 'Enter CTA button text',
        type: 'text',
        required: true,
        className: 'w-[48%]',
    },
    {
        name: 'placeholder_text',
        label: 'Input Placeholder Text',
        placeholder: 'Enter Your Email Address',
        type: 'text',
        required: false,
        className: 'w-[48%]',
    },
];

export const leadFormInputs = [
    {
        name: 'title',
        label: 'Title',
        placeholder: 'Get In Touch With Us',
        type: 'text',
        required: true,
        className: 'w-[48%]',
    },
    {
        name: 'description',
        label: 'Description',
        placeholder: 'Have questions? We are here to help.',
        type: 'textarea',
        required: true,
        className: 'w-[48%]',
    },
    {
        name: 'cta_button',
        label: 'Action Button Text',
        placeholder: 'Contact Us Now',
        type: 'text',
        required: true,
        className: 'w-[48%]',
    },
    {
        name: 'details_required',
        label: 'Fields to Collect (select at least one)',
        placeholder: '',
        type: 'checkbox',
        required: true,
        className: 'w-[48%]',
        options: [
            { label: 'Name', value: 'name' },
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
        ],
    },
];

/**
 * Insert the lead magnet node into the Plate editor based on the specified placement.
 *
 * - 'above_fold': Inserts the node after the first node.
 * - 'inline_mid_post': Inserts the node after certain headings (h1, h2, h3) based on their count.
 * - 'sticky_sidebar': No operation; handled elsewhere.
 *
 * Prevents duplicate insertion of the same lead magnet node.
 *
 * @param {any} editor - The Plate editor instance.
 * @param {any} pluginData - The lead magnet node data to insert.
 * @param {'above_fold' | 'inline_mid_post' | 'sticky_sidebar'} placement - Placement type for the lead magnet.
 */
export function insertLeadMagnetNode(
    editor: any,
    pluginData: any,
    placement: 'above_fold' | 'inline_mid_post' | 'sticky_sidebar'
) {
    const nodes = editor.children;
    const isLeadMagnetExists = nodes.find(
        (node: any) =>
            node.type === 'lead_magnet' && node.plugin_data_id === pluginData.plugin_data_id
    );

    if (isLeadMagnetExists) {
        return;
    }

    if (pluginData.lead_magnet_type === 'newsletter' || pluginData.lead_magnet_type === 'news-letter') {
        const nodes = [...editor.children];
        // Remove existing newsletter nodes first to avoid duplicates
        const filteredNodes = nodes.filter(
            (node: any) => node.lead_magnet_type !== 'newsletter' && node.lead_magnet_type !== 'news-letter'
        );
        filteredNodes.push(pluginData);
        editor.tf.setValue(filteredNodes);
        return;
    }

    if (placement === 'above_fold') {
        editor.tf.insertNode(pluginData, { at: [1] });
    } else if (placement === 'inline_mid_post') {
        const nodes = editor.children;
        let headingIndexes = [];
        let modifiedNodes = [...nodes];
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].type === 'h1' || nodes[i].type === 'h2' || nodes[i].type === 'h3') {
                headingIndexes.push(i);
            }
        }

        const incrementThreshold = headingIndexes.length > 3 ? 3 : 1;
        for (let j = 2; j < headingIndexes.length; j += incrementThreshold) {
            modifiedNodes.splice(headingIndexes[j] + 1, 0, pluginData);
        }
        editor.tf.setValue(modifiedNodes);
    } else if (placement === 'sticky_sidebar') {
        // Insert at the end of the document.
        // The actual sticky visual rendering is handled by the template component
        // via the `placement` prop passed through LeadMagnetTemplateView.
        const lastIndex = editor.children.length;
        editor.tf.insertNode(pluginData, { at: [lastIndex] });
    }
}

/**
 * Removes a lead magnet node from the Plate editor by its ID.
 *
 * Filters out nodes of type 'lead_magnet' with the specified plugin_data_id.
 * Updates the editor value if any nodes remain after removal.
 *
 * @param {PlateEditor} editor - The Plate editor instance.
 * @param {string} leadMagnetId - The ID of the lead magnet node to remove.
 */
export async function removeLeadMagnetFromEditor(editor: PlateEditor, leadMagnetId: string) {
    const nodes = editor.children;

    const filteredNodes = nodes.filter(
        (node: any) => node.type !== 'lead_magnet' || node.plugin_data_id !== leadMagnetId
    );

    if (filteredNodes.length > 0) {
        editor.tf.setValue(filteredNodes);
    }
}
