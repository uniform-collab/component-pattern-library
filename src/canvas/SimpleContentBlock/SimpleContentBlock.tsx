import { SimplifiedConditions, processConditions } from '@/utilities/simplifyConditions';
import { FC } from 'react';

export type ContentBlockProps = {
  title: string;
  conditionalValue: SimplifiedConditions;
};

export const SimpleContentBlock: FC<ContentBlockProps> = ({ title, conditionalValue }) => {
  let titleClass = 'border border-warning-content w-[20rem]';
  console.log('SimpleContentBlock conditionalValue', JSON.stringify(conditionalValue, null, 1));

  const simplifiedConditions = processConditions(conditionalValue);

  if (simplifiedConditions?.parameters?.width) {
    titleClass = `border border-warning-content s:w-[${simplifiedConditions?.parameters?.width?.mobile}rem] md:w-[${simplifiedConditions?.parameters?.width?.tablet}rem] lg:w-[${simplifiedConditions?.parameters?.width?.desktop}rem] visible`;
  }

  if (simplifiedConditions?.visibility) {
    titleClass += ` ${!simplifiedConditions?.visibility?.mobile ? 's:invisible' : ''} 
    ${!simplifiedConditions?.visibility?.tablet ? 'md:invisible' : ''} ${!simplifiedConditions?.visibility?.desktop ? 'lg:invisible' : ''} `;
  }

  return (
    <>
      <div className="w-full">
        <div className={titleClass}>
          {title}
          <hr />
          <pre>{JSON.stringify(simplifiedConditions, null, 2)}</pre>
        </div>
      </div>
    </>
  );
};
