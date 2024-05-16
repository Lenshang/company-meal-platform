import { IRouterConfig, lazy } from 'ice';
import Layout from '@/Layouts/BasicLayout';
import UserLayout from "@/Layouts/UserLayout";
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Home = lazy(() => import('@/pages/Home'));
const NotFound = lazy(() => import('@/components/NotFound'));
const Login = lazy(() => import('@/pages/Login'));
const PersonSetting = lazy(() => import('@/pages/PersonSetting'));
const SystemUser = lazy(() => import('@/pages/SystemUser'));
const MealMenu = lazy(() => import('@/pages/MealMenu'));
const routerConfig: IRouterConfig[] = [
    {
        path: '/user',
        component: UserLayout,
        children: [
            { path: '/login', component: Login },
            // { path: '/register', component: Register },
            { path: '/feedback-server-error', component: NotFound },
            { path: '/', redirect: '/user/login' },
        ],
    },
    {
        path: '/',
        component: Layout,
        children: [
            { path: '/dashboard', component: Dashboard, },
            { path: '/Home', exact: true, component: Home, },
            { path: '/meal-menu', component: MealMenu },
            { path: '/person-setting', component: PersonSetting },
            { path: '/system-user', component: SystemUser },
            { path: "/", redirect: "/Home" },
            { component: NotFound, }
        ],
    },
];

export default routerConfig;
