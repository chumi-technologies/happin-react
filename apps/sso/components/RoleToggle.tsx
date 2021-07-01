import classNames from 'classnames';
import { ERole, useAppState } from 'contexts/state';

export const RoleToggle = ({ className }: { className: string }) => {
  const { role, setRole } = useAppState();

  return (
    <div className={className}>
      {Object.values(ERole).map((item, index) => (
        <div
          key={index}
          className={classNames('toggle-tab-item', { active: role === item })}
          onClick={() => setRole(item)}
        >{item}</div>
      ))}
    </div>
  )
}
