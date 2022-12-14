import axios from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './LizingForm.module.sass';
import { deleteSpace, formatNumber } from './utils';

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
    const [sum, setSum] = useState('0');
    const [monthPay, setMonthPay] = useState('0');

    const { register, handleSubmit, watch, setValue, getValues, reset } = useForm<ILizingFormData>({
        defaultValues: {
            price: '3 300 000',
            priceRange: '3300000',
            initialPayment: '429 000',
            initialPaymentRange: '13',
            leasingPeriod: '60',
            leasingPeriodRange: '60'
        }
    });

    const onSubmit = useCallback(
        (data: ILizingFormData) => {
            console.log(data);
            axios
                .post('https://eoj3r7f3r4ef6v4.m.pipedream.net', {
                    price: data.price,
                    initialPayment: data.initialPayment,
                    leasingPeriod: data.leasingPeriod
                })
                .then(({ data }) => {
                    console.log(data);
                })
                .catch(function (error) {
                    console.log(error.message);
                });
            reset();
        },
        [reset]
    );

    const changeInitialPayment = useCallback(
        (percent: number) => {
            const newInitialPayment = Math.round((deleteSpace(getValues('price')) / 100) * percent);
            setValue('initialPayment', formatNumber(newInitialPayment.toString()));
        },
        [getValues, setValue]
    );

    const changeSum = useCallback(
        (monthPay: number) => {
            console.log(monthPay);
            setSum(
                formatNumber(
                    Math.round(
                        deleteSpace(
                            deleteSpace(getValues('initialPayment')) +
                                deleteSpace(getValues('leasingPeriod')) * monthPay
                        )
                    )
                )
            );
        },
        [getValues]
    );

    const changeMonthPay = useCallback(() => {
        const newValue = Math.round(
            deleteSpace(getValues('price')) -
                deleteSpace(getValues('initialPayment')) *
                    ((0.035 * Math.pow(1 + 0.035, deleteSpace(getValues('leasingPeriod')))) /
                        (Math.pow(1 + 0.035, deleteSpace(getValues('leasingPeriod'))) - 1))
        );
        setMonthPay(formatNumber(newValue));
        changeSum(newValue);
    }, [changeSum, getValues]);


    useEffect(() =>{
        changeMonthPay()
    },[changeMonthPay])

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name && type === 'change') {
                // console.log(value[name]);
                switch (name) {
                    case 'priceRange':
                        console.log(formatNumber(value[name] as string));
                        setValue('price', formatNumber(value[name] as string));
                        changeInitialPayment(percent);
                        changeMonthPay();
                        break;
                    case 'price':
                        console.log('+++++');
                        const priceValue =
                            value[name] && deleteSpace(value[name] as string) > 1000000
                                ? (value[name] as string)
                                : '1000000';
                        setValue('priceRange', priceValue.toLocaleString());
                        changeInitialPayment(percent);
                        changeMonthPay();
                        break;
                    case 'initialPaymentRange':
                        setPercent(deleteSpace(value[name] as string));
                        changeInitialPayment(deleteSpace(value[name] as string));
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
                <h1 className={styles.title}>?????????????????????? ?????????????????? ???????????????????? ?? ????????????</h1>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formInput}>
                        <Input
                            placeholder="?????????????????? ????????????????????"
                            register={register}
                            minRange={1000000}
                            maxRange={6000000}
                            name={'price'}
                            description="???"
                            max={6000000}
                        />
                        <Input
                            placeholder="???????????????????????????? ??????????"
                            register={register}
                            minRange={10}
                            maxRange={60}
                            name={'initialPayment'}
                            percent={percent}
                            max={3600000}
                        />
                        <Input
                            placeholder="???????? ??????????????"
                            register={register}
                            minRange={1}
                            maxRange={60}
                            name={'leasingPeriod'}
                            description="??????."
                            max={60}
                        />
                    </div>
                    <div className={styles.wrap}>
                        <div className={styles.block}>
                            <p className={styles.text}>?????????? ???????????????? ??????????????</p>
                            <span className={styles.sum}>{sum.toLocaleString()} ???</span>
                        </div>
                        <div className={styles.block}>
                            <p className={styles.text}>?????????????????????? ???????????? ????</p>
                            <span className={styles.sum}>{monthPay.toLocaleString()} ???</span>
                        </div>
                        <div className={styles.block}>
                            <Button type="submit" title="???????????????? ????????????" />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default LizingForm;
