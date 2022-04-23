import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { StylesConfig, ThemeConfig } from 'react-select';
import Script from 'next/script';

type formData = {
  location: any;
}
const selectStyles: StylesConfig<any, boolean> = {
  control: (provided, state) => ({
    ...provided,
    background: 'transparent',
    boxShadow: 'none',
    borderWidth: '2px',
    borderColor: state.isFocused ? '#808080' : '#454545',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: '2px 12px'
  }),
  menu: (provided) => ({
    ...provided,
    background: '#222222'
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#fafafa' : '#e8e8e8',
    backgroundColor: state.isSelected ? '#454545' : (state.isFocused ? '#333' : 'transparent')
  }),
};
const selectTheme: ThemeConfig = theme => ({
  ...theme,
  borderRadius: 8,
  spacing: {
    ...theme.spacing,
    controlHeight: 44,
  },
  colors: {
    ...theme.colors,
    primary: '#808080',
    primary50: '#3d3d3d',
    neutral30: '#808080',
    neutral80: '#fafafa',
  }
});

export default function CreateEventSet() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<formData>({ mode: 'all' });

  const onFormSubmit = async (data: formData) => {
    console.log(data)
    try {
      const location = await geocodeByPlaceId(data.location.value.place_id);
      const form = {
        coordinates: [location[0].geometry.location.lng(), location[0].geometry.location.lat()],
        city: data.location.value.terms.length < 3 ? data.location.value.terms[0].value : data.location.value.terms.slice(-3)[0],
        country: data.location.value.terms.slice(-1)[0]
      }
      console.log(form);
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <Script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyCaXFzIMrHWJfJO-YQYjd3Jv5KgQAMjVoo&language=en" strategy="beforeInteractive" />
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <form>
            <div>
              <label htmlFor="location" className="form-label required">
                City (Just need to be precise to the city)
              </label>
              <Controller
                name="location"
                control={control}
                rules={{
                  validate: {
                    required: value => {
                      console.log(value);
                      if (value?.value.terms.length < 2 || (value?.value.terms.length === 2 && value?.value.types[0] === 'administrative_area_level_1')) {
                        return 'Please type the city exactly.'
                      }
                      if (value) {
                        return true;
                      }
                      return 'City is required.'
                    },
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <GooglePlacesAutocomplete
                    selectProps={{
                      instanceId: 'address',
                      value,
                      onChange,
                      onBlur,
                      placeholder: 'City of the event',
                      isClearable: true,
                      theme: selectTheme,
                      styles: selectStyles
                    }}
                  />
                )}
              />
              {errors.location && (
                <div className="text-rose-500 text-sm ml-1 mt-1">{errors.location.message}</div>
              )}
            </div>
            <button
              disabled={isSubmitting}
              onClick={handleSubmit(onFormSubmit)}
              className="block w-full btn btn-yellow !px-0 !font-semibold !rounded-full mt-10"
            >
              <span className="text-sm sm:text-base">{isSubmitting ? 'Saving...' : 'Save'}</span>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
