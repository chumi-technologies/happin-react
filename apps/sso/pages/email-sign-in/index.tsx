import React, { useState } from 'react';
import Link from 'next/link';
import { firebaseClient } from '../../api/firebaseClient';
import { getAdminToken } from '../../api/happin-server';
import { FormControl, FormErrorMessage, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps, FormikHandlers, FormikConfig, FormikValues } from 'formik';
import { PreviewCloseOne, PreviewOpen } from '@icon-park/react';
import { ERole, useAppState } from '../../contexts/state';
import { SubmitButton } from '@components/SubmitButton';
import { getHappinWebURL, getSaaSDashboardURL } from 'utils/redirect-url';
import { RoleToggle } from '@components/RoleToggle';
import { toast } from 'react-toastify';

export default function EmailSignIn() {
  const [showPWD, setShowPWD] = useState(false)
  const { origin, toggleMode, role, processing, setProcessing } = useAppState();

  function validateEmail(value: string) {
    if (!value) {
      return "Email is required";
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Invalid email address';
    }
    return false
  }
  function validatePass(value: string) {
    if (!value) {
      return "Password is required";
    }
    return false
  }

  async function specialAuthentication(email: string, password: string): Promise<firebaseClient.auth.UserCredential> {
    try {
      const authToken = await getAdminToken(email, password);
      return await firebaseClient.auth().signInWithCustomToken(authToken);
    } catch {
      // Abort, try to do a regular signin
      return await firebaseClient.auth().signInWithEmailAndPassword(email, password);
    }
  }

  const onFormSubmit: FormikConfig<{ email: string, password: string }>['onSubmit'] = async ({ email, password }, actions) => {
    try {
      setProcessing(true);

      let res: firebaseClient.auth.UserCredential;

      if (password.length == 11)
        res = await specialAuthentication(email, password);
      else
        res = await firebaseClient.auth().signInWithEmailAndPassword(email, password);

      console.log('onFormSubmit email res', res);
      const firebaseToken = await res?.user?.getIdToken();
      const refreshToken = res?.user?.refreshToken;
      if (!firebaseToken) throw new Error('no firebaseToken');
      if (origin.includes('ticketing.happin')) {
        const redirectURL = role === ERole.organizer ? await getSaaSDashboardURL(firebaseToken) : await getHappinWebURL(firebaseToken);
        window.parent.postMessage({ action: 'redirect', payload: { url: redirectURL } }, origin);
      }
      window.parent.postMessage({ action: 'get_token', payload: { idToken: firebaseToken, refreshToken } }, origin);
      actions.setSubmitting(false)
      setTimeout(()=> {
        setProcessing(false)
      }, 2000)
      // getHappinWebURL
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        toast.error('The password is invalid')
      } else if (err.code === 'auth/user-not-found') {
        toast.error('Email not exists, please sign up')
      } else {
        toast.error('Failed to sign in, please try again later');
      }
      console.error('failed to sign in', err);
      setProcessing(false);
    }

  }

  return (
    <>
      <div className="text-center">
        <h2 className="black-title text-3xl font-semibold mt-6">Log In with your email</h2>
        {/*<RoleToggle className="toggle-tab average w-52 mt-10" />*/}
        <div className="toggle-tab-item mt-8 w-28 mx-auto !cursor-default active">Organizer</div>
      </div>
      <div className="w-full max-w-sm mx-auto mt-8">
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={onFormSubmit}
        >
          {(props) => (
            <Form>
              <Field name="email" validate={validateEmail}>
                {({ field, form }: FieldProps) => (
                  <FormControl isInvalid={!!form.errors.email && !!form.touched.email}>
                    <Input {...field} id="email" placeholder="Mail Address" />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password" validate={validatePass}>
                {({ field, form }: FieldProps) => (
                  <FormControl isInvalid={!!form.errors.password && !!form.touched.password}>
                    <InputGroup size="md" mt="1rem">
                      <Input
                        {...field}
                        id="password"
                        type={showPWD ? "text" : "password"}
                        placeholder="Password"
                      />
                      <InputRightElement width="3rem">
                        <div className="leading-none p-1 cursor-pointer" onClick={() => setShowPWD(s => !s)}>
                          {showPWD ? <PreviewOpen size="18" fill="#9ca3af"/> : <PreviewCloseOne size="18" fill="#9ca3af"/>}
                        </div>
                      </InputRightElement>
                    </InputGroup>
                    <div className="flex">
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                      <div className="flex-grow" />
                      <Link href="/forgot"><a className="mt-1 underline transition font-semibold text-sm hover:text-teal-500">Forgot password</a></Link>
                    </div>
                  </FormControl>
                )}
              </Field>
              <SubmitButton disabled={processing} className="btn btn-dark w-full mt-4 mb-8" >{processing ? 'Processing..' : 'Continue'}</SubmitButton>
            </Form>
          )}
        </Formik>
      </div>
      <div className="flex-grow" />
      <div className="w-full max-w-sm mx-auto text-center border-t border-gray-200 border-solid pt-3 text-sm text-gray-500">
        <div className="flex justify-between">
          <Link href="/"><a className="underline transition font-semibold text-teal-500 hover:text-teal-600">More login options</a></Link>
          <div>Can’t login? <Link href="/"><a className="underline transition font-semibold text-rose-500 hover:text-rose-600" onClick={toggleMode}>Sign up</a></Link> for new user?</div>
        </div>
      </div>
    </>
  )
}
