<template>
  <div
    v-if="reg_show_alert"
    :class="reg_alert_variant"
    class="text-white text-center font-bold p-4 rounded mb-4"
  >
    {{ reg_alert_msg }}
  </div>
  <vee-form :validation-schema="schema" :initial-values="userData" @submit="register">
    <!-- Name -->
    <div class="mb-3 flex flex-col">
      <label class="inline-block mb-2" :class="{ 'self-start': $i18n.locale === 'ar' }">{{
        $t('register.name')
      }}</label>
      <vee-field
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('register.namePlaceholder')"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3 flex flex-col">
      <label class="inline-block mb-2" :class="{ 'self-start': $i18n.locale === 'ar' }">{{
        $t('register.email')
      }}</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('register.emailPlaceholder')"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3 flex flex-col">
      <label class="inline-block mb-2" :class="{ 'self-start': $i18n.locale === 'ar' }">{{
        $t('register.age')
      }}</label>
      <vee-field
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('register.agePlaceholder')"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3 flex flex-col">
      <label class="inline-block mb-2" :class="{ 'self-start': $i18n.locale === 'ar' }">{{
        $t('register.password')
      }}</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('register.passwordPlaceholder')"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3 flex flex-col">
      <label class="inline-block mb-2" :class="{ 'self-start': $i18n.locale === 'ar' }">{{
        $t('register.confirmPassword')
      }}</label>
      <vee-field
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('register.confirmPasswordPlaceholder')"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3 flex flex-col">
      <label class="inline-block mb-2" :class="{ 'self-start': $i18n.locale === 'ar' }">{{
        $t('register.country')
      }}</label>
      <vee-field
        name="country"
        as="select"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Egypt">{{ $t('register.egypt') }}</option>
        <option value="Palastine">{{ $t('register.palastine') }}</option>
        <option value="Norway">{{ $t('register.norway') }}</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <i18n-t keypath="register.accept" tag="label" class="inline-block float-right">
        <a href="#">{{ $t('register.tos') }}</a>
      </i18n-t>
      <vee-field name="tos" type="checkbox" value="1" class="w-4 h-4 mr-2 rounded" />
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>

    <button
      :disabled="reg_in_submission"
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      {{ $t('register.submit') }}
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'RegisterForm',
  data() {
    return {
      //Schema for Form Validation
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|email|min:3|max:100',
        age: 'required|min_value:16|max_value:110',
        password: 'required|min:9|max:20|excluded:password',
        confirm_password: 'passwords_mismatch:@password',
        country: 'required',
        tos: 'tos'
      },

      userData: {
        //Default Values
        country: 'Egypt'
      },
      //Regesteration alert.
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Please wait! Your account is being created.'
    }
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: 'register'
    }),
    async register(values) {
      //Placeholder while the authentication promise is resolved.
      this.reg_show_alert = true
      this.reg_in_submission = true
      this.reg_alert_variant = 'bg-blue-500'
      this.reg_alert_msg = 'Please wait! Your account is being created.'

      //Authentication Process.
      try {
        await this.createUser(values)
      } catch (error) {
        //If error occured, alert a red alert.
        this.reg_in_submission = false
        this.reg_alert_variant = 'bg-red-500'
        this.reg_alert_msg = 'An expected error occured! Please try again later.'
        return
      }

      //If Authentication process happened succefully.
      this.reg_alert_variant = 'bg-green-500'
      this.reg_alert_msg = 'Success! Your account has been created!'

      window.location.reload()
    }
  }
}
</script>
