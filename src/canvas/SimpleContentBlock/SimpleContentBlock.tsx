import { SimplifiedConditions } from '@/utilities/conditionHelper';
import { FC } from 'react';

export type ContentBlockProps = {
  title: string;
  conditionalValue: SimplifiedConditions;
};

export const SimpleContentBlock: FC<ContentBlockProps> = ({ title, conditionalValue }) => {
  let titleClass = 'border border-warning-content';

  //console.log('SimpleContentBlock conditionalValue', JSON.stringify(conditionalValue, null, 1));

  if (conditionalValue?.parametersConditions) {
    titleClass += ` s:w-[${conditionalValue?.parametersConditions?.mobile?.width}rem] md:w-[${conditionalValue?.parametersConditions?.tablet?.width}rem] lg:w-[${conditionalValue?.parametersConditions?.desktop?.width}rem] visible`;
  }

  if (conditionalValue?.visibilityConditions) {
    titleClass += ` ${!conditionalValue?.visibilityConditions?.mobile ? 's:invisible' : ''}
    ${!conditionalValue?.visibilityConditions?.tablet ? 'md:invisible' : ''} ${!conditionalValue?.visibilityConditions?.desktop ? 'lg:invisible' : ''} `;
  }

  return (
    <>
      <div className="w-full">
        <div className={titleClass}>
          {title}
          <hr />
          <pre>{JSON.stringify(conditionalValue, null, 1)}</pre>
        </div>
      </div>
    </>
  );
};
