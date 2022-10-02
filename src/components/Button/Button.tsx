import classNames from 'classnames';
import { FC } from 'react';
import styles from './Button.module.sass';

interface IButtonProps {
    title: string;
    isLoading?: boolean;
}

const Button: FC<IButtonProps> = ({ title, isLoading }) => {
    return (
        <button className={classNames(styles.button, isLoading && styles.loadingBtn)}>
            {isLoading ? (
                <div className={styles.loader}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            ) : (
                title
            )}
        </button>
    );
};

export default Button;
