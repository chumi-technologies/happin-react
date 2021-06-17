import React, { useState } from 'react';
import Link from 'next/Link';
import { FormControl, FormErrorMessage, Input } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';

export default function Forgot() {

  function validateEmail(value: string) {
    if (!value) {
      return "Email is required";
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Invalid email address';
    }
    return false
  }

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mt-6">Log In with your email</h2>
          <div className="text-gray-500 leading-tight mt-3 max-w-sm mx-auto">Enter the email address associated with your account we’ll email you a link to reset your password.
          </div>
        </div>
        <div className="w-full max-w-sm mx-auto mt-12">
          <Formik
            initialValues={{ email: '' }}
            onSubmit={async (values, actions) => {
              console.log(values);
              actions.setSubmitting(false)
              // window.location.href = '/';
            }}
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
                <button className="btn btn-light w-full mt-10" type="submit">Send reset link</button>
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
      </div>
    </div>
  )
}
