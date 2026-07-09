import React from 'react'
import { Twitter, Linkedin } from 'lucide-react'

interface SocialLinksProps {
  isPreview?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ isPreview }) => {
  return (
    <div className='flex flex-col space-y-3'>
      <h3 className='font-semibold text-lg uppercase tracking-wide text-textPrimary mb-2'>
        COMMUNITY
      </h3>
      {isPreview ? (
        <>
          <span className='flex items-center text-textSecondary hover:text-primary transition-colors cursor-pointer'>
            <Twitter className='h-4 w-4 mr-2' />
            Follow on X
          </span>
          <span className='flex items-center text-textSecondary hover:text-primary transition-colors cursor-pointer'>
            <Linkedin className='h-4 w-4 mr-2' />
            Follow on LinkedIn
          </span>
        </>
      ) : (
        <>
          <a
            href='https://twitter.com'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center text-textSecondary hover:text-primary transition-colors'
          >
            <Twitter className='h-4 w-4 mr-2' />
            Follow on X
          </a>
          <a
            href='https://linkedin.com'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center text-textSecondary hover:text-primary transition-colors'
          >
            <Linkedin className='h-4 w-4 mr-2' />
            Follow on LinkedIn
          </a>
        </>
      )}
    </div>
  )
}

export default SocialLinks
