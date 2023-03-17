import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Styles from './index.scss';

const enum SCREEN {
  small = '768',
  large = '1440',
}
const enum LANGUAGE {
  en,
  cn,
}
const text = {
  [LANGUAGE.en]: {
    [SCREEN.small]: [
      'Save up to 20€. All items included.',
      'Min. spend: 10.00€. Valid for 30 day(s)',
      'I want it!',
    ],
    [SCREEN.large]: [
      'Aplicable to all items',
      'Min. order 10€. Valid for 30 days from now.',
      '¡Lo quiero!',
    ],
  },
  [LANGUAGE.cn]: {
    [SCREEN.small]: ['最多节省20€', '最低消费10.00€,30天内有效', '立即获得'],
    [SCREEN.large]: ['适用于所有项目', '最低10欧元。30天内有效。', '立即获得'],
  },
};

function useCountDown(endTime: number): {
  hour: number;
  minute: number;
  second: number;
} {
  const { initHour, initMinute, initSecond } = useMemo<{
    initHour: number;
    initMinute: number;
    initSecond: number;
  }>(() => {
    const current = new Date().getTime();
    const initHour = Math.floor((endTime - current) / 1000 / 60 / 60);
    const initMinute = Math.floor(((endTime - current) / 1000 / 60) % 60);
    const initSecond = Math.floor(
      (((endTime - current) / 1000) % (60 * 60)) % 60
    );
    return { initHour, initMinute, initSecond };
  }, [endTime]);
  const [hour, setHour] = useState<number>(initHour);
  const [minute, setMinute] = useState<number>(initMinute);
  const [second, setSecond] = useState<number>(initSecond);

  useEffect(() => {
    if (hour === 0 && minute === 0 && second === 0) {
      return;
    }
    let timer: any = setTimeout(() => {
      const current = new Date().getTime();
      const hour = Math.floor((endTime - current) / 1000 / 60 / 60);
      const minute = Math.floor(((endTime - current) / 1000 / 60) % 60);
      const second = Math.floor(
        (((endTime - current) / 1000) % (60 * 60)) % 60
      );
      setHour(hour);
      setMinute(minute);
      setSecond(second);
    }, 1000);
    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
  }, [second, minute, hour, endTime]);
  return {
    hour: hour,
    minute: minute,
    second: second,
  };
}
const CountDown: React.FC = function () {
  const day = new Date().getDay();

  const endTime = useMemo<number>(() => {
    return new Date(
      new Date(new Date().toLocaleDateString()).getTime() +
        24 * 60 * 60 * 1000 -
        1
    ).getTime();
  }, [day]); // 当天23:59
  const { hour, minute, second } = useCountDown(endTime);
  return (
    <div className={Styles.countDown}>
      Ends in
      <div className={Styles.time}>{hour}</div>h
      <div className={Styles.time}>{minute}</div>m
      <div className={Styles.time}>{second}</div>s
    </div>
  );
};

const useText: () => string[] = () => {
  const code = useMemo(() => {
    return window.innerWidth > 768 ? SCREEN.large : SCREEN.small;
  }, []);
  const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.en);
  const [text1, setText1] = useState<string>(text[language][code][0]);
  const [text2, setText2] = useState<string>(text[language][code][1]);
  const [text3, setText3] = useState<string>(text[language][code][2]);

  const watchViewPort = useCallback(
    (e: any) => {
      if (e.target.innerWidth > 768) {
        setText1(text[language][SCREEN.large][0]);
        setText2(text[language][SCREEN.large][1]);
        setText3(text[language][SCREEN.large][2]);
      } else {
        setText1(text[language][SCREEN.small][0]);
        setText2(text[language][SCREEN.small][1]);
        setText3(text[language][SCREEN.small][2]);
      }
    },
    [language]
  );
  useEffect(() => {
    if (localStorage.getItem('language') === null) {
      fetch('/api/getText')
        .then((res) => res.json())
        .then((res) => {
          const code = res.languageCode;
          const key = code === 1 ? LANGUAGE.cn : LANGUAGE.en;
          setLanguage(key);
          if (window.innerWidth > 768) {
            setText1(text[key][SCREEN.large][0]);
            setText2(text[key][SCREEN.large][1]);
            setText3(text[key][SCREEN.large][2]);
          } else {
            setText1(text[key][SCREEN.small][0]);
            setText2(text[key][SCREEN.small][1]);
            setText3(text[key][SCREEN.small][2]);
          }
        });
    }
  }, []);
  useEffect(() => {
    window.addEventListener('resize', watchViewPort);
    return () => window.removeEventListener('resize', watchViewPort);
  }, [watchViewPort]);
  return [text1, text2, text3];
};
const CouponBanner: React.FC = function () {
  const [text1, text2, text3] = useText();
  return (
    <div className={Styles.container}>
      <div className={Styles.enjoy}>Enjoy now your favorite brands with</div>
      <div className={Styles.discount}>30% off</div>
      <div className={Styles.textArea}>
        <div className={Styles.discountIntextArea}>
          <p>30%</p>
          <p>off</p>
        </div>
        <div className={Styles.descArea}>
          <p className={Styles.title}>Welcome Coupon</p>
          <p className={Styles.desc}>{text1}</p>
          <p className={Styles.desc}>{text2}</p>
          <div className={Styles.button}>{text3}</div>
        </div>
      </div>
      <CountDown />
    </div>
  );
};
export default CouponBanner;
