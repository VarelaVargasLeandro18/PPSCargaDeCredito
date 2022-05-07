import { BarCodeScanner } from 'expo-barcode-scanner';
import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Button, Title } from 'react-native-paper';

import { GlobalContainer } from '../../components/centeredVHContainer';
import { UserContext } from '../../userContext';
import firebase from '../../utils/firebase';
import { styles } from '../LogIn/styles';

export const Home = ( {navigation} : any ) => {
    const {email} = useContext(UserContext);
    const [esAdmin, setEsAdmin] = useState<boolean>(false);
    const [credito, setCredito] = useState<number>( 0 );
    const [sumar, setSumar] = useState<number>( 0 );
    const [hasPermission, setHasPermission] = useState<boolean>();
    const [scanned, setScanned] = useState<boolean>(false);
    const qrs : any = {
        "8c95def646b6127282ed50454b73240300dccabc": 10,
        "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172": 50,
        "2786f4877b9091dcad7f35751bfcf5d5ea712b2f": 100
    }
    const [lastQr, setLastQr] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect( () => {
        firebase.firestore().collection( 'CargaDeCredito' ).where( 'usuario', '==', email ).get()
            .then( data => data.docs )
            .then( docs => docs[0] )
            .then( doc => doc.data() )
            .then( data => setEsAdmin( data.rol === "admin" ) )
            .catch( error => console.error(error) );
    }, [email] );

    const handleBarCodeScanned = ({ type, data } : any) => {
        if (  !data || !qrs[data] || scanned ) {
            console.error(data);
            return
        }

        setScanned(true);
        firebase.firestore().collection('CargaDeCredito')
            .where( 'qr', '==', data ).where( 'usuario', '==', email )
            .get()
            .then( data => data.docs )
            .then( docs => {
                const cantidad = docs.length;

                if ( !esAdmin && cantidad >= 1 ) {
                    setError("Un Usuario solo puede cargar un mismo código una vez.");
                    setSumar(0);
                    return
                }
                if( esAdmin && cantidad >= 2 ) {
                    setError("Un Usuario Administrador solo puede cargar un mismo código hasta dos veces.");
                    setSumar(0);
                    return
                }

                setSumar( qrs[data] );
                setScanned(false);
                setLastQr( data )
                setError("");
            } )
    };

    const sumarCredito = () => {
        if ( sumar === 0 ) return

        setCredito( credito + sumar );
        setSumar(0);
        subirQR( lastQr )
    }

    const subirQR = ( qr : string ) => {
        firebase.firestore().collection( 'CargaDeCredito' ).doc( (new Date()).toISOString() ).set( { usuario: email, qr } )
            .catch( error => console.error(error) );
    }

    return (
    <GlobalContainer navigation={navigation}>
        <Text style={customStyles.whiteText}>Su Crédito actual: {credito}</Text>
        <Text style={ {backgroundColor: '#F005',top: -100, color: 'white', zIndex: 10} }>{error}</Text> 
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
        />
        <Text style={customStyles.text}>A sumar: {sumar}</Text>
        <Button style={ customStyles.button } onPress={ () => sumarCredito() }>
            <Text style={ styles.buttonText }>Cargar</Text>
        </Button>
    </GlobalContainer>    )
};

const customStyles = StyleSheet.create({
    text: {
        color: 'white',
        bottom: -150
    },
    button: {
        ...styles.buttonLogIn,
        bottom: -50
    },
    whiteText: {
        color: 'white'
    }
});