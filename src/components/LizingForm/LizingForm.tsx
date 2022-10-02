import { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './LizingForm.module.sass';

export interface ILizingFormData {
    price: string;
    priceRange: string;
    initialPayment: string;
    initialPaymentRange: string;
    leasingPeriod: string;
    leasingPeriodRange: string;
}

const LizingForm: FC = () => {
    const [percent, setPercent] = useState(13);
    const [sum, setSum] = useState(0);
    const [monthPay, setMonthPay] = useState(0);

    const { register, handleSubmit, watch, setValue, getValues } = useForm<ILizingFormData>({
        defaultValues: {
            price: '3300000',
            priceRange: '3300000',
            initialPayment: '429000',
            initialPaymentRange: '13',
            leasingPeriod: '60',
            leasingPeriodRange: '60'
        }
    });

    const onSubmit = useCallback((data: ILizingFormData) => {
        console.log(data);
    }, []);

    const changeInitialPayment = useCallback(
        (percent: number) => {
            const newInitialPayment = ((Number(getValues('price')) / 100) * percent).toFixed(1);
            setValue('initialPayment', newInitialPayment.toString());
        },
        [getValues, setValue]
    );

    const changeSum = useCallback(
        (monthPay: number) => {
            setSum(
                Number((Number(getValues('initialPayment')) + Number(getValues('leasingPeriod')) * monthPay).toFixed(1))
            );
        },
        [getValues]
    );

    const changeMonthPay = useCallback(() => {
        const newValue = (
            Number(getValues('price')) -
            Number(getValues('initialPayment')) *
                ((0.035 * Math.pow(1 + 0.035, Number(getValues('leasingPeriod')))) /
                    (Math.pow(1 + 0.035, Number(getValues('leasingPeriod'))) - 1))
        ).toFixed(2);
        setMonthPay(Number(newValue));
        changeSum(Number(newValue));
    }, [changeSum, getValues]);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name && type === 'change') {
                console.log(value[name]);
                switch (name) {
                    case 'priceRange':
                        setValue('price', value[name] as string);
                        changeInitialPayment(percent);
                        changeMonthPay();
                        break;
                    case 'price':
                        const priceValue =
                            value[name] && Number(value[name]) > 1000000 ? (value[name] as string) : '1000000';
                        setValue('priceRange', priceValue);
                        changeInitialPayment(percent);
                        changeMonthPay();
                        break;
                    case 'initialPaymentRange':
                        setPercent(Number(value[name]));
                        changeInitialPayment(Number(value[name]));
                        changeMonthPay();
                        break;
                    case 'leasingPeriodRange':
                        setValue('leasingPeriod', value[name] as string);
                        changeMonthPay();
                        break;
                    case 'leasingPeriod':
                        const periodValue = value[name] && Number(value[name]) > 1 ? (value[name] as string) : '1';
                        setValue('leasingPeriodRange', periodValue);
                        changeMonthPay();
                        break;
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [changeInitialPayment, changeMonthPay, percent, setValue, watch]);

    return (
        <section className={styles.lizing}>
            <div className={styles.lizingWrap}>
                <h1 className={styles.title}>Рассчитайте стоимость автомобиля в лизинг</h1>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formInput}>
                        <Input
                            placeholder="Стоимость автомобиля"
                            register={register}
                            minRange={1000000}
                            maxRange={6000000}
                            name={'price'}
                            description="₽"
                        />
                        {/* <span className={styles.label}>P</span> */}
                        <Input
                            placeholder="Первоначальный взнос"
                            register={register}
                            minRange={10}
                            maxRange={60}
                            name={'initialPayment'}
                            percent={percent}
                        />
                        <Input
                            placeholder="Срок лизинга"
                            register={register}
                            minRange={1}
                            maxRange={60}
                            name={'leasingPeriod'}
                            description="мес."
                        />
                    </div>
                    <div className={styles.wrap}>
                        <div className={styles.block}>
                            <p className={styles.text}>Сумма договора лизинга</p>
                            <span className={styles.sum}>{sum}</span>
                        </div>
                        <div className={styles.block}>
                            <p className={styles.text}>Ежемесячный платеж от</p>
                            <span className={styles.sum}>{monthPay}</span>
                        </div>
                        <div className={styles.block}>
                            <Button title="Оставить заявку" />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default LizingForm;
