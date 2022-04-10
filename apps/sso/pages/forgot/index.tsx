import React, { useState } from 'react';
import Link from 'next/link';
import { FormControl, FormErrorMessage, Input } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps, FormikConfig } from 'formik';
import { SubmitButton } from '@components/SubmitButton';
import { firebaseClient } from '../../api/firebaseClient';
import { toast } from 'react-toastify';
import { useAppState } from 'contexts/state';

export default function Forgot() {

  const { origin } = useAppState();

  function validateEmail(value: string) {
    if (!value) {
      return "Email is required";
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Invalid email address';
    }
    return false
  }

  const onForgotFormSubmit: FormikConfig<{email: string}>['onSubmit'] = async ({ email }, actions) => {
    try {
      const actionCodeSetting = {
        url: 'https://happin.app',
        handelCodeInApp: true,
      }
      await firebaseClient.auth().sendPasswordResetEmail(email, actionCodeSetting)
      window.parent.postMessage({ action: 'reset_requested', payload: { reset: true } }, origin);
      actions.setSubmitting(false)
    } catch (error: any) {
      if (error.code  === 'auth/user-not-found') {
        toast.error(`No account exists for ${email}`);
      } else {
        toast.error('Failed to send reset link');
      }
      console.log('Failed to send reset link', error.message);
    }
  }

  return (
    <>
      <div className="text-center">
        <h2 className="black-title text-3xl font-semibold mt-6">Log In with your email</h2>
        <div className="text-gray-500 leading-tight mt-3 max-w-sm mx-auto">Enter the email address associated with your account we’ll email you a link to reset your password.
        </div>
      </div>
      <div className="w-full max-w-sm mx-auto mt-12">
        <Formik
          initialValues={{ email: '' }}
          onSubmit={onForgotFormSubmit}
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
              <SubmitButton className="btn btn-dark w-full mt-10">Send reset link</SubmitButton>
            </Form>
          )}
        </Formik>
      </div>
      <div className="flex-grow" />
      <div className="w-full max-w-sm mx-auto text-center border-t border-gray-200 border-solid pt-3 text-sm text-gray-500">
        <div className="flex justify-between">
          <Link href="/"><a className="underline transition font-semibold text-teal-500 hover:text-teal-600">More login options</a></Link>
          <div>Can’t login? <Link href="/"><a className="underline transition font-semibold text-rose-500 hover:text-rose-600">Sign up</a></Link> for new user?</div>
        </div>
      </div>
    </>
  )
}
