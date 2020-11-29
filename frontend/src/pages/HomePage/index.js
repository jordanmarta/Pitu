import React from 'react';
import Header from '../../components/Header';
import { ContentContainer, Form, AdsBlock } from './styles';
import { Alert, Button, Container, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import ShortenerService from '../../services/shortenerService';
import { Link } from 'react-router-dom';
import vars from '../../configs/vars';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            url: '',
            code: '',
            errorMessage: ''
        }
    }

    handleSubmit = async(event) => {
        event.preventDefault();
        
        const { url } = this.state;
    
        if(!url)
        {
            this.setState({ isLoading: false, errorMessage: 'Informe uma url para encurtar.' });
        }
        else if(!this.isValidUrl(url))
        {
            this.setState({ isLoading: false, errorMessage: 'Informe uma URL válida!' });
        }
        else
        {
            this.setState({ isLoading: true, errorMessage: '' });

            try {
                const service = new ShortenerService();
                const result = await service.generate({ url });
                console.log('O POST FOI FEITO!');
                console.log(result)
                if(result.status) {
                    this.setState({ isLoading: false, code: result.link.code });
                } else {
                    this.setState({ isLoading: false, errorMessage : result.msg });
                }
    
            } catch(error) {
                this.setState({ isLoading: false, errorMessage: 'Ops, ocorreu um errinho básico...' });
            }
        }        
    }

    isUrlExists = (string) => {

    }

    isValidUrl = (string) => {
        try {
          new URL(string);
        } catch (_) {
          return false;  
        }
      
        return true;
      }

    copyToClipboard = () => {
        const element = this.inputURL;
        element.select();
        document.execCommand('copy');
    }

    render() {
        const { isLoading, errorMessage, code } = this.state;

        return (
            <Container>
                <Header>Seu novo encurtador de URL. :)</Header>
                <ContentContainer>
                    <Form onSubmit={this.handleSubmit}>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Digite a url para encurtar"
                                defaultValue=""
                                onChange={e => this.setState({ url: e.target.value })}
                            />
                            <InputGroup.Append>
                                <Button variant="primary" type="submit">Encurtar</Button>
                            </InputGroup.Append>
                        </InputGroup>

                        {isLoading ? (
                            <Spinner animation="border" />
                        ) : (
                            code && !errorMessage && (
                                <>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            autoFocus={true}
                                            defaultValue={vars.HOST_APP + code}
                                            ref={(input) => this.inputURL = input}
                                        />
                                        <InputGroup.Append>
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={() => this.copyToClipboard()}
                                            >
                                                Copiar
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>                                     
                                    <p>Para acompanhar as estatísticas, acesse <Link to={"/" + code + "/stats"}>{vars.HOST_APP + code}/stats</Link></p>
                                </>
                            )
                        )}
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    </Form>
                </ContentContainer>
                <ContentContainer>
                    {/* <AdsBlock>Adense</AdsBlock> */}
                </ContentContainer>
            </Container>
        )
    }
}

export default HomePage;