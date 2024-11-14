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
    titleClass += `invisible ${!conditionalValue?.visibilityConditions?.mobile ? 's:visible' : ''}
    ${!conditionalValue?.visibilityConditions?.tablet ? 'md:visible' : ''} ${!conditionalValue?.visibilityConditions?.desktop ? 'lg:visible' : ''} `;
  }

  return (
    <>
      <div className="border border-info-content">
        <div className="text-center">
          <h1>{title}</h1>
        </div>
        <div className="w-full">
          <div className={titleClass}>
            <p className="s:visible">{conditionalValue?.parametersConditions?.mobile?.title}</p>
            <p className="md:visible">{conditionalValue?.parametersConditions?.tablet?.title}</p>
            <p className="lg:visible">{conditionalValue?.parametersConditions?.desktop?.title}</p>
            <hr />
          </div>
          <pre>{JSON.stringify(conditionalValue, null, 1)}</pre>
        </div>
      </div>
    </>
  );
};
