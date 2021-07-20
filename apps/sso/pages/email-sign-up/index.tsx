import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { firebaseClient } from '../../api/firebaseClient';
import { FormControl, FormErrorMessage, Input, InputGroup, InputRightElement, Checkbox, Tooltip } from '@chakra-ui/react';
import classNames from 'classnames';
import { Formik, Form, Field, FieldProps, useFormikContext, useFormik, FormikConfig } from 'formik';
import { PreviewCloseOne, PreviewOpen } from '@icon-park/react';
import { SubmitButton } from '@components/SubmitButton';
import { ERole, useAppState } from 'contexts/state';
import { RoleToggle } from '@components/RoleToggle';
import { getHappinWebURL, getSaaSDashboardURL } from 'utils/redirect-url';
import { signUpHappin } from 'api/happin-server';


interface IFormValues {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

export default function EmailSignUp() {
  const [showPWD, setShowPWD] = useState(false);
  const [age, setAge] = useState(false);
  const [terms, setTerms] = useState(false);
  const [ageState, setAgeState] = useState(false);
  const [termsState, setTermsState] = useState(false);
  const { origin, role } = useAppState();


  useEffect(() => {
    age && setAgeState(false)
    terms && setTermsState(false)
  }, [age, terms])

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
  function validateFirstName(value: string) {
    if (!value) {
      return "First name is required";
    }
    return false
  }
  function validateLastName(value: string) {
    if (!value) {
      return "Last name is required";
    }
    return false
  }
  /*function validateAgeTerms(value: boolean) {
    if (!value) {
      return "Last name is required";
    }
    return false
  }*/

  const onFormSubmit: FormikConfig<IFormValues>['onSubmit'] = async ({ email, password }, actions) => {
    try {
      const res = await firebaseClient.auth().createUserWithEmailAndPassword(email, password);
      console.log('onFormSubmit email res', res);
      const firebaseToken = await res?.user?.getIdToken();
      if (firebaseToken) {
        await signUpHappin(firebaseToken, { version: 2 });
        const redirectURL = role === ERole.organizer ? await getSaaSDashboardURL(firebaseToken) : await getHappinWebURL(firebaseToken);
        console.log('redirectURL', redirectURL);
        window.parent.postMessage({ action: 'redirect', payload: { url: redirectURL } }, origin);
      }
      actions.setSubmitting(false)
    } catch (error) {
      if (error.code.includes('auth/email-already-in-use')) {
        alert('Email exists, please try another one.')
      } else if (error.code === 'auth/invalid-email') {
        alert('This email is invalid')
      } else if (error.code === 'auth/weak-password') {
        alert('The password should be at least 6 characters')
      } else if (error.code === 'auth/operation-not-allowed') {
        alert('This account is disabled, please contact support')
      } else {
        alert('Failed to sign up, please contact support');
      }
      console.log('Failed to sign up', error.message);
    }
  }

  return (
    <>
      <div className="text-center">
        <h2 className="black-title text-3xl font-semibold">Sign up</h2>
        <div className="text-gray-500 text-sm mt-3">Let’s Sign up first for enter into Happin Website</div>
        <RoleToggle className="toggle-tab average w-52 mt-10" />
      </div>
      <div className="w-full max-w-sm mx-auto mt-8">
        <Formik
          initialValues={{firstName: '', lastName: '', email: '', password: ''}}
          onSubmit={onFormSubmit}
        >
          {(props) => (
            <Form>
              <div className="flex">
                <Field name="firstName" validate={validateFirstName}>
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={!!form.errors.firstName && !!form.touched.firstName}>
                      <Input {...field} id="firstName" placeholder="First Name" />
                      <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="lastName" validate={validateLastName}>
                  {({ field, form }: FieldProps) => (
                    <FormControl ml={4} isInvalid={!!form.errors.lastName && !!form.touched.lastName}>
                      <Input {...field} id="lastName" placeholder="Last Name" />
                      <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </div>
              <Field name="email" validate={validateEmail}>
                {({ field, form }: FieldProps) => (
                  <FormControl isInvalid={!!form.errors.email && !!form.touched.email}>
                    <Input mt={4} {...field} id="email" placeholder="Mail Address" />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password" validate={validatePass}>
                {({ field, form }: FieldProps) => (
                  <FormControl isInvalid={!!form.errors.password && !!form.touched.password}>
                    <InputGroup size="md" mt={4}>
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
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <SubmitButton
                className="btn btn-dark w-full mt-4 mb-8"
                onClick={() => {
                  if (!age) {
                    setAgeState(true)
                  }
                  if (!terms) {
                    setTermsState(true)
                  }
                }}
              >Continue</SubmitButton>
              {/*<Field name="ageTerms" validate={validateAgeTerms}>
                {({ field, form }: FieldProps) => (
                  <FormControl isInvalid={!!form.errors.ageTerms && !!form.touched.ageTerms}>
                    <Checkbox id="ageTerms" {...field}>
                      <span className="text-sm leading-none text-gray-600">I’m 13 or over years of age</span>
                    </Checkbox>
                  </FormControl>
                )}
              </Field>*/}
              <Checkbox
                isChecked={age}
                isInvalid={ageState}
                onChange={() => {
                  setAge(s => !s)
                }}
              >
                <span className="text-sm leading-none text-gray-600">I’m 13 or over years of age</span>
              </Checkbox>
              <Checkbox
                isChecked={terms}
                isInvalid={termsState}
                mt={1}
                onChange={() => {
                  setTerms(s => !s)
                }}
              >
                <span className="text-sm leading-none text-gray-600">I agree to Happin’s <Link href="/"><a className="transition text-rose-500 hover:text-rose-600">Term of Use</a></Link> and <Link href="/"><a className="transition text-rose-500 hover:text-rose-600">Privacy Policy.</a></Link></span>
              </Checkbox>
            </Form>
          )}
        </Formik>
      </div>
      <div className="flex-grow" />
      <div className="w-full max-w-sm mx-auto mt-6 text-center border-t border-gray-200 border-solid pt-3 text-sm text-gray-500">
        <div className="flex justify-between">
          <Link href="/"><a className="underline transition font-semibold text-teal-500 hover:text-teal-600">More login options</a></Link>
          <div>Already onboard? <Link href="/"><a className="underline transition font-semibold text-rose-500 hover:text-rose-600" >Log in</a></Link></div>
        </div>
      </div>
    </>
  )
}
