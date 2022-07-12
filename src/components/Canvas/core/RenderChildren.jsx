import FR from './index';

const RenderChildren = ({ preview }, { slots }) => {
  return (
    <>
      {slots.default &&
        slots.default().map((child, i) => {
          const FRProps = {
            id: child,
            preview
          };
          return <FR key={i.toString()} {...FRProps} />;
        })}
    </>
  );
};

export default RenderChildren;
