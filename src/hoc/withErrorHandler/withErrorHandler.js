import React, { useState, useEffect } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';


const withErrorHandler = (WrappedComponent, axios) => {
  return (props) => {
    const [error, setError] = useState(null);
    let reqInterceptor = null;
    let resInterceptor = null;

    useEffect(() => {
      reqInterceptor = axios.interceptors.request.use((req) => {
        setError(null);
        return req;
      });
      resInterceptor = axios.interceptors.response.use(res => res, err => {
        setError(err);
      });

      return () => {
        axios.interceptors.request.eject(reqInterceptor);
        axios.interceptors.response.eject(resInterceptor);
      }
    }, []);

    return (
      <Aux>
        <Modal
          show={error}
          modalClosed={() => setError(null)}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  }
}

export default withErrorHandler;