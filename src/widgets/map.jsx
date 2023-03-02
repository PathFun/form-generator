export default function map(props, { slots }) {
  if (!/^#/.test(props.schema._id)) {
    return <div class="w-100">{slots.default ? slots.default() : null}</div>;
  }

  return (
    <div class="flex flex-column">
      {slots.default ? slots.default() : null}
    </div>
  );
}
