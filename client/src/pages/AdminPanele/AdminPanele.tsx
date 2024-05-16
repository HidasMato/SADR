import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPanele.module.scss";
import ProfileAPI from "../../api/Profile.api";

const AdminPanele = (): JSX.Element => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<boolean>(false);
    const [isHaveIAdminPanele, setIsHaveIAdminPanele] = useState<boolean>(false);
    useEffect(() => {
        const getUserInfo = async () => {
            const a = await ProfileAPI.haveIAdminPanel();
            if (a.status === 200) setIsHaveIAdminPanele(a.access);
            setStatus(true);
        };
        getUserInfo();
    }, []);
    const Content = () => {
        return (
            <div className={styles.Main}>
                <div className={styles.Flesh}>
                    <div className={styles.ProfileFlesh}></div>
                </div>
            </div>
        );
    };
    if (!status) return <div>Загрузка...</div>;
    else if (!isHaveIAdminPanele) return <div>Ошибка</div>;
    else return Content();
};

export default AdminPanele;
