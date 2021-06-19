import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/Link';
import { firebaseClient } from '../../api/firebaseClient';
import { FormControl, FormErrorMessage, Input, InputGroup, InputRightElement, Checkbox, Tooltip } from '@chakra-ui/react';
import classNames from 'classnames';
import { Formik, Form, Field, FieldProps, useFormikContext, useFormik } from 'formik';
import { PreviewCloseOne, PreviewOpen } from '@icon-park/react';
import { SubmitButton } from '@components/SubmitButton';

export default function EmailLogin() {
  const [showPWD, setShowPWD] = useState(false);
  const [roleCur, setRoleCur] = useState(0);
  const [age, setAge] = useState(false);
  const [terms, setTerms] = useState(false);
  const [ageState, setAgeState] = useState(false);
  const [termsState, setTermsState] = useState(false);
  const roleList = ['Fan', 'Organizer'];

  useEffect(() => {
    console.log(age, terms);
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

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Sign up</h2>
          <div className="text-gray-500 text-sm mt-3">Let’s Sign up first for enter into Happin Website</div>
          <div className="toggle-tab average w-52 mt-10">
            {roleList.map((item, index) => (
              <div
                key={index}
                className={classNames('toggle-tab-item', { active: roleCur === index })}
                onClick={() => setRoleCur(index)}
              >{item}</div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-sm mx-auto mt-8">
          <Formik
            initialValues={{firstName: '', lastName: '', email: '', password: ''}}
            onSubmit={async ({firstName, lastName, email, password}, actions) => {
              console.log(111);
              actions.setSubmitting(false)
              // const res = await firebaseClient.auth().signInWithEmailAndPassword(email, password);
              // const parsed = JSON.parse(JSON.stringify(res));
              // console.log(parsed.user.stsTokenManager.accessToken)
              // window.location.href = '/';
            }}
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
      </div>
    </div>
  )
}
