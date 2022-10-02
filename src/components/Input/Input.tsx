import { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { ILizingFormData } from '../LizingForm/LizingForm';
import styles from './Input.module.sass';

type InputNames =
    | 'price'
    | 'initialPayment'
    | 'leasingPeriod'
    | 'priceRange'
    | 'initialPaymentRange'
    | 'leasingPeriodRange';

interface IInputProps {
    //Подумать как передевать тип
    register: UseFormRegister<ILizingFormData>;
    minRange: number;
    maxRange: number;
    name: InputNames;
    placeholder: string;
    percent?: number;
}
const Input: FC<IInputProps> = ({ minRange, maxRange, register, name, placeholder, percent }) => {
    return (
        <div className={styles.wrap}>
            <span className={styles.placeholder}>{placeholder}</span>
            <div className={styles.inputWrap}>
                <input type="text" className={styles.input} {...register(name)} />
                <div className={styles.rangeWrap}>
                    <input
                        className={styles.range}
                        type="range"
                        min={minRange}
                        max={maxRange}
                        {...register(`${name}Range` as InputNames)}
                    />
                </div>
                {percent && <span className={styles.percentLabel}>{percent}%</span>}
            </div>
        </div>
    );
};

export default Input;
