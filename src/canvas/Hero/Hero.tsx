import { useUniformContextualEditingState } from '@uniformdev/canvas-react';
import { useQuirks, useUniformContext } from '@uniformdev/context-react';
import classNames from 'classnames';
import { FC } from 'react';
import { AnimationVariant } from '../../components/AnimatedContainer';
import { REGEX_COLOR_HEX } from '../../utilities';
import { DEFAULT_TEXT_COLOR, HeroProps } from './';
import { useHeroAnimation } from './animation';
import { Container, Description, EyebrowText, PrimaryButton, SecondaryButton, Title } from './atoms';
import { getHeroTextStyle } from './helpers';

export const HeroDefault: FC<HeroProps> = ({
  title,
  titleStyle = 'h1',
  description,
  primaryButtonCopy,
  primaryButtonLink,
  primaryButtonStyle = 'primary',
  primaryButtonAnimationType,
  secondaryButtonCopy,
  secondaryButtonLink,
  secondaryButtonStyle = 'primary',
  secondaryButtonAnimationType,
  useCustomTextElements = false,
  fullHeight,
  animationType,
  duration = 'medium',
  animationOrder,
  backgroundType, // Deprecated
  backgroundColor,
  containerVariant,
  paddingBottom,
  paddingTop,
  marginBottom,
  marginTop,
  textColorVariant, // Deprecated
  textColor = DEFAULT_TEXT_COLOR,
  animationPreview,
  delay = 'none',
  styles,
  conditionalValue,
}) => {
  const { previewMode } = useUniformContextualEditingState();
  const isContextualEditing = previewMode === 'editor';

  const currentColor = REGEX_COLOR_HEX.test(textColorVariant || textColor || DEFAULT_TEXT_COLOR)
    ? textColor
    : undefined;
  const baseTextStyle = getHeroTextStyle(textColorVariant || textColor);

  const { ElementWrapper, getDelayValue } = useHeroAnimation({
    duration,
    animationOrder,
    delay,
    animationType,
    animationPreview,
  });

  const { context } = useUniformContext();
  const data = useQuirks();

  return (
    <Container
      fullHeight={fullHeight}
      className={classNames({ [baseTextStyle]: !currentColor })}
      paddingBottom={paddingBottom}
      paddingTop={paddingTop}
      marginBottom={marginBottom}
      marginTop={marginTop}
      backgroundType={backgroundColor || backgroundType}
      containerVariant={containerVariant}
    >
      <p>Is Uniform Context available yet? {context ? 'Yes' : 'No'}</p>
      <div
        className={classNames('hero-content text-center p-0', {
          'h-full items-start pt-20': fullHeight,
        })}
        style={{ color: currentColor }}
      >
        <div className={classNames('flex flex-col mx-1 md:mx-10 z-20')}>
          <ElementWrapper
            duration={duration}
            delay={getDelayValue(0)}
            animationVariant={animationType === 'fadeIn' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            <EyebrowText className={styles?.eyebrowText} />
          </ElementWrapper>
          <ElementWrapper
            duration={duration}
            delay={getDelayValue(1.5)}
            animationVariant={animationType === 'fadeIn' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            {!conditionalValue && (
              <Title
                titleStyle={titleStyle}
                useCustomTextElements={useCustomTextElements}
                title={title}
                className={styles?.title}
              />
            )}

            <div className={styles?.title}>{conditionalValue?.parametersConditions?.desktop?.title}</div>
            <div className={styles?.title}>{conditionalValue?.parametersConditions?.tablet?.title}</div>
            <div className={styles?.title}>{conditionalValue?.parametersConditions?.mobile?.title}</div>
          </ElementWrapper>
          <ElementWrapper
            duration={duration}
            delay={getDelayValue(3)}
            animationVariant={animationType === 'fadeIn' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            <Description className={styles?.description} />
            <pre>{JSON.stringify(data, null, 1)}</pre>
          </ElementWrapper>
          <div className={classNames('pb-6', { 'py-6': !description })}>
            {(Boolean(primaryButtonCopy) || isContextualEditing) && (
              <ElementWrapper
                duration={duration}
                delay={getDelayValue(4.5)}
                animationVariant={animationType === 'fadeIn' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
              >
                <PrimaryButton
                  animationType={primaryButtonAnimationType}
                  primaryButtonLink={primaryButtonLink}
                  primaryButtonStyle={primaryButtonStyle}
                />
              </ElementWrapper>
            )}
            {(Boolean(secondaryButtonCopy) || isContextualEditing) && (
              <ElementWrapper
                duration={duration}
                delay={getDelayValue(6)}
                animationVariant={animationType === 'fadeIn' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
              >
                <SecondaryButton
                  animationType={secondaryButtonAnimationType}
                  secondaryButtonLink={secondaryButtonLink}
                  secondaryButtonStyle={secondaryButtonStyle}
                />
              </ElementWrapper>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
