import FR from './index';

const RenderChildren = ({ preview, _children }) => {
  return (
    <>
      {_children.map((child, i) => {
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
