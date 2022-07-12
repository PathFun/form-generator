import { Input } from 'ant-design-vue';
import { changeKeyFromUniqueId, getKeyFromUniqueId } from '../utils';

export default function IdInput({ onChange, value, disabled, readonly, options }) {
  const handleChange = e => {
    try {
      const newId = changeKeyFromUniqueId(value, e.target.value);
      onChange(newId);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <Input disabled={disabled || readonly} {...options} onChange={handleChange} value={getKeyFromUniqueId(value)} />
  );
}
