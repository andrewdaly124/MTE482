import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './index.module.scss';

const cx = classNames.bind(styles);

export default function InputField({
  value,
  onChange,
  size,
  type = 'input',
  placeholder = '',
}) {
  const [sizeStyles, setSizeStyles] = useState({});

  useEffect(() => {
    // size styles select
    switch (size) {
      case 'small':
        setSizeStyles(styles.small);
        break;
      case 'normal':
        setSizeStyles(styles.normal);
        break;
      case 'large':
        setSizeStyles(styles.large);
        break;
      default:
        setSizeStyles(styles.normal);
    }
  }, []);

  return (
    <div
      className={cx({
        [styles.inputField]: true,
        [sizeStyles]: true,
      })}
    >
      <div className={styles.hoverContainer}>
        {type === 'input' ? (
          <input
            type="text"
            onChange={onChange}
            value={value}
            placeholder={placeholder}
          />
        ) : (
          <textarea
            type="text"
            onChange={onChange}
            value={value}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}

InputField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};
