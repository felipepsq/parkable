import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    Image,
    AsyncStorage
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import gps from '../../assets/imgs/faq/gps.png'
import addSpace from '../../assets/imgs/faq/addSpace.png'
import traceRoute from '../../assets/imgs/faq/traceRoute.png'
import usingSpace from '../../assets/imgs/faq/usingSpace.png'
import reportSpace from '../../assets/imgs/faq/reportSpace.png'
import exitSpace from '../../assets/imgs/faq/exitSpace.png'
import gpsPrecision from '../../assets/imgs/faq/gpsPrecision.png'
import leftMenu from '../../assets/imgs/faq/leftMenu.png'
import logout from '../../assets/imgs/faq/logout.png'
import stopRoute from '../../assets/imgs/faq/stopRoute.png'
export default class Faq extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false,
        }
    }

    async UNSAFE_componentWillMount() {
        await Expo.Font.loadAsync({
            'Ubuntu': require('../../assets/fonts/Ubuntu.ttf'),
            'Ubuntu_bold': require('../../assets/fonts/Ubuntu_bold.ttf'),
        });
        this.setState({ fontLoaded: true });
    }

    componentDidMount() {
        if (!(this.props.navigation.state.params && this.props.navigation.state.params.read)) {
            AsyncStorage.setItem('faqRead', 'true')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.iconBar}>
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                        <Icon name='bars' color={'white'} size={32} />
                    </TouchableOpacity>
                </View>

                {this.state.fontLoaded ?
                    <ScrollView style={styles.textContainer} showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Bem vindo ao FAQ do app ParkAble!</Text>

                        <Text style={styles.subtitle}>Aviso importante:</Text>
                        <Text style={styles.simpleText}>Primeiramente, para ter acesso a todas as funcionalidades do aplicativo,
                        é necessário você estar com conexão à internet e com o GPS ligado, assim, podemos entregar à você uma
                        melhor experiência de uso.
                        </Text>

                        <Text style={styles.subtitle}>Como ir até a minha localização no mapa?</Text>
                        <Text style={styles.simpleText}>No canto direito inferior, há um botão responsável por aproximar a câmera para onde
                        sua localização se encontra no mapa.
                        </Text>
                        <Image style={[styles.textPhoto, { width: '90%', height: 80 }]}
                            resizeMode='center' source={gps} />

                        <Text style={styles.subtitle}>Como cadastrar uma nova vaga no mapa?</Text>
                        <Text style={styles.simpleText}>Ao carregar o mapa, você precisa navegar até o ponto onde deseja
                        cadastrar uma nova vaga, e pressionar de forma contínua (toque longo) até um pop-up aparecer
                        com as opções de seleção de vaga para deficiente ou idoso, e o ponto de referência para ter como
                        base de localização, após é necessário confirmar estas informações, clicando no botão 'Confirmar'.
                        </Text>
                        <Image style={[styles.textPhoto, { width: '70%', height: 200 }]}
                            resizeMode='center' source={addSpace} />

                        <Text style={styles.subtitle}>Como traçar a rota para uma vaga específia?</Text>
                        <Text style={styles.simpleText}>É necessário procurar por uma vaga já cadastrada no mapa,
                        e após clicar sobre esta, abrirá uma caixa de itens contendo a opção 'Traçar rota',
                        onde clicada, irá traçar uma linha preta pela menor rota processada pelo aplicativo baseada na
                        sua localização atual.
                        </Text>
                        <Image style={[styles.textPhoto, { width: '55%', height: 170 }]}
                            resizeMode='center' source={traceRoute} />

                        <Text style={styles.subtitle}>Como informar que uma vaga é inexistente?</Text>
                        <Text style={styles.simpleText}>Caso queira informar que uma das vagas cadastradas é inexistente,
                        basta você clicar sobre a vaga em questão, e a seguir pressionar na opção 'Reportar vaga' (imagem no item
                        acima), localizada na caixa de itens que apareceu sobre o mapa. A exclusão desta vaga é dada após a mesma
                        ser confirmada pelo toque no botão "Sim" do pop-up aberto na parte inferior da tela, e depois de ter
                        sido reportada por dois usuários diferentes.
                        </Text>
                        <Image style={[styles.textPhoto, { width: '90%', height: 130 }]}
                            resizeMode='center' source={reportSpace} />

                        <Text style={styles.subtitle}>Como marcar que estou utilizando uma vaga?</Text>
                        <Text style={styles.simpleText}>A partir do momento em que uma rota é traçada no mapa, o aplicativo
                        irá observar por mudanças na localização, assim, quando você estiver em um raio de 25 metros distante da
                        vaga, irá aparecer um pop-up na parte inferior da sua tela solicitando se você irá utilizar esta vaga
                        ou não. Para marcar ela como em uso, você precisará clicar na opção "Sim" contida no pop-up, caso contrário,
                        na opção "Não".
                        </Text>
                        <Image style={[styles.textPhoto, { width: '90%', height: 130 }]}
                            resizeMode='center' source={usingSpace} />

                        <Text style={styles.subtitle}>Como liberar uma vaga que estou usando?</Text>
                        <Text style={styles.simpleText}>Após você marcar uma vaga como "Em uso", é necessário você pressionar
                        em cima da vaga que está usando e em seguida clicar na opção "Liberar vaga", assim irá aparecer um
                        pop-up na parte inferior da sua tela solicitando sua liberação, que ocorre a partir da confirmação pela
                        opção "Sim".
                        </Text>
                        <Image style={[styles.textPhoto, { width: '55%', height: 170 }]}
                            resizeMode='center' source={exitSpace} />

                        <Text style={styles.subtitle}>Por que está aparecendo a mensagem "GPS sem precisão!"?</Text>
                        <Text style={styles.simpleText}>Isto ocorre devido a baixa precisão do GPS diante sua atual
                        localização. Para melhorá-la, você precisa estar ao ar livre com o seu dispositivo, como na calçada
                        ou dentro do carro localizado na rua.
                        </Text>
                        <Image style={[styles.textPhoto, { width: '90%', height: 80 }]}
                            resizeMode='center' source={gpsPrecision} />

                        <Text style={styles.subtitle}>Como acessar o menu lateral?</Text>
                        <Text style={styles.simpleText}>Para isso, você precisa clicar no ícone contido no canto superior esquerdo
                        no formato de três barras (imagem no item de cima), logo, uma aba lateral irá abrir para acessar as telas
                        como: "Mapa", "FAQ" e "Configurações". Caso você esteja em uma tela diferente de "Mapa", basta arrastar o
                        dedo na direção esquerda para direita, e o menu irá se abrir.
                        </Text>
                        <Image style={[styles.textPhoto, { width: '70%', height: 170 }]}
                            resizeMode='center' source={leftMenu} />

                        <Text style={styles.subtitle}>Como sair/trocar de usuário?</Text>
                        <Text style={styles.simpleText}>Após você entrar no aplicativo com um usuário já cadastrado, é necessário
                        navegar até o menu lateral e clicar no item "Configurações", lá está contida a opção "Sair", responsável
                        por desconectar a sua conta atual da aplicação.
                        </Text>
                        <Image style={[styles.textPhoto, { width: '70%', height: 170 }]}
                            resizeMode='center' source={logout} />

                        <Text style={styles.subtitle}>Informações úteis:</Text>

                        <Text style={styles.simpleText}>- Após você traçar a rota com base na vaga desejada, o aplicativo
                        irá desenhar uma linha verde no mapa indicando o trajeto já percorrido por você, conforme mudanças
                        ocorridas na sua localização.
                        </Text>

                        <Text style={styles.simpleText}>- Diante de uma rota traçada no mapa, você poderá cancelá-la
                        atráves de um botão contido no canto inferior esquerdo em forma de "X" na cor vermelha.
                        </Text>
                        <Image style={[styles.textPhoto, { width: '90%', height: 80, marginTop: 5, marginBottom: 10 }]}
                            resizeMode='center' source={stopRoute} />

                        <Text style={styles.simpleText}>- Após você marcar uma vaga como "Em uso", o sistema observará sua
                        localização, e caso ela estiver a mais de 400 metros distante da vaga reservada, a mesma será
                        automaticamente liberada.
                        </Text>

                        <Text style={styles.simpleText}>- Caso você já possuir uma vaga reservada em seu usuário e
                        clicar para reservar outra, o sistema irá automaticamente tirar a sua reserva da anterior.
                        </Text>

                        <Text style={styles.simpleText}>- Mediante duas horas a partir do momento da reserva de uma vaga,
                        sem sua liberação dentro deste tempo, a vaga será liberada pelo sistema.
                        </Text>

                        <View style={styles.mapContainer}>
                            <TouchableOpacity style={styles.mapButton} onPress={() => { this.props.navigation.navigate('Map') }} >
                                <Text style={styles.mapButtonText}>
                                    Ir para o mapa!
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                    : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    iconBar: {
        position: 'absolute',
        top: 50,
        left: 20,
        alignSelf: 'flex-start',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#747d8c'
    },
    textContainer: {
        width: '90%',
        height: '87%',
        marginTop: 95,
        overflow: 'scroll'
    },
    title: {
        color: '#fff',
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'Ubuntu_bold',
        marginBottom: 10
    },
    subtitle: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Ubuntu',
        marginTop: 10,
        marginBottom: 5
    },
    simpleText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Ubuntu',
        paddingLeft: 20,
        textAlign: 'justify',
        marginBottom: 5
    },
    mapContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40
    },
    mapButton: {
        backgroundColor: '#27ae60',
        width: '40%',
        height: 50,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12
    },
    mapButtonText: {
        fontFamily: 'Ubuntu',
        fontSize: 16,
        color: 'white'
    },
    textPhoto: {
        alignSelf: 'center',
        marginLeft: 20,
        borderRadius: 15
    }
})