import { useEffect, useState } from 'react';
import { useRequest } from 'ice';
import { Table, Col, Row, Card, Select, Checkbox, List, message, Avatar, Button } from 'antd';
import HttpClient from '@/utils/HttpClient';
import styles from './index.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <Card title="首页">

            </Card>
        </div>
    );
}
