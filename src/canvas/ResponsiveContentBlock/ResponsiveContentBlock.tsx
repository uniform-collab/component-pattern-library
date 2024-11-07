import { FC } from 'react';

export type ContentBlockProps = {
  title: string;
  responsiveTitle: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
};

export const ResponsiveContentBlock: FC<ContentBlockProps> = ({ responsiveTitle, title }) => {
  const titleClass = `border border-info-content s:w-[${responsiveTitle?.mobile}rem] md:w-[${responsiveTitle?.tablet}rem] lg:w-[${responsiveTitle?.desktop}rem]`;
  //titleClass = 'border border-info-content s:w-[60rem] md:w-[30rem] lg:w-[10rem]';

  return (
    <>
      <div className="w-full">
        <h3>
          Example with responsive CSS, Uniform only provides values from component props, but doesnt do the conditional
          logic
        </h3>
        <div className={titleClass}>{title}</div>
      </div>
    </>
  );
};
