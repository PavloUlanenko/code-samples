'use client'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import React, { useEffect } from 'react'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Typography,
  Stack
} from '@mui/material'
import { useForm, Controller, FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Post, ServerActionResponseState, Tag } from '@/common-types/types'
import { useFormState } from 'react-dom'
import { addEditPost } from '@/server-actions/addEditPost'
import { postSchema } from '@/lib/validations'
import SubmitButton from '@/components/submit-button'
import { ERROR_STATUS, SUCCESS_STATUS } from '@/constant'
import { useNotifications } from '@toolpad/core/useNotifications'
import { addEditPostFormDefaultValues } from './constants'

type PostDefaultValues = Omit<Post, 'tags'> & { tags: number[] }

interface PostFormProps {
  tags: Tag[]
  defaultValues?: (Omit<Post, 'tags'> & { tags: number[] }) | null
}

const AddEditPost: React.FC<PostFormProps> = ({ tags, defaultValues }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [state, formAction] = useFormState<
    ServerActionResponseState | null,
    FormData
  >(addEditPost, null)
  const notifications = useNotifications()

  const {
    control,
    setError,
    resetField,
    formState: { errors }
  } = useForm<PostDefaultValues>({
    mode: 'all',
    resolver: zodResolver(postSchema),
    defaultValues: defaultValues || addEditPostFormDefaultValues
  })

  useEffect(() => {
    if (!state) {
      return
    }

    if (state.status === ERROR_STATUS) {
      state.errors?.forEach(error => {
        setError(error.path as FieldPath<PostDefaultValues>, {
          message: error.message
        })
      })

      if (state.message && !state.errors) {
        notifications.show(state.message, {
          severity: ERROR_STATUS,
          autoHideDuration: 3000
        })
      }
    }
    if (state.status === SUCCESS_STATUS) {
      notifications.show(state.message, {
        severity: SUCCESS_STATUS,
        autoHideDuration: 3000
      })
      if (!defaultValues) {
        resetField('slug', { defaultValue: '' })
      }
    }
  }, [state, setError])

  return (
    <>
      <Typography variant='h4' textAlign={'center'} mb={7} mt={10}>
        {defaultValues ? 'Edit Post' : 'Here you can add a new post ✨'}
      </Typography>
      <Box component='form' action={formAction}>
        <Stack flexDirection='row' gap={2}>
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <TextField
                size='small'
                {...field}
                label='Title *'
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                margin='normal'
              />
            )}
          />
          <Controller
            name='slug'
            control={control}
            render={({ field }) => (
              <TextField
                size='small'
                {...field}
                label='Slug *'
                fullWidth
                error={!!errors.slug}
                helperText={errors.slug?.message}
                margin='normal'
              />
            )}
          />
        </Stack>
        <Controller
          name='content'
          control={control}
          render={({ field }) => (
            <Box sx={{ mt: 2, mb: 1 }} data-testid={'html-editor-wrap'}>
              <input type={'hidden'} {...field} name='content' />
              <ReactQuill
                value={field.value}
                onChange={field.onChange}
                theme='snow'
                placeholder='Write your post content...'
              />
              {errors.content && (
                <div style={{ margin: '3px 14px 0 14px' }}>
                  <FormHelperText error>
                    {errors.content?.message}
                  </FormHelperText>
                </div>
              )}
            </Box>
          )}
        />
        <Controller
          name='summary'
          control={control}
          render={({ field }) => (
            <TextField
              size='small'
              {...field}
              label='Summary'
              fullWidth
              error={!!errors.summary}
              helperText={errors.summary?.message}
              margin='normal'
            />
          )}
        />
        <Controller
          name='featured_image'
          control={control}
          render={({ field }) => (
            <TextField
              size='small'
              {...field}
              label='Featured Image URL'
              fullWidth
              rows={3}
              multiline
              error={!!errors.featured_image}
              helperText={errors.featured_image?.message}
              margin='normal'
            />
          )}
        />
        <Stack flexDirection='row' gap={2}>
          <Controller
            name='featured_image_description'
            control={control}
            render={({ field }) => (
              <TextField
                size='small'
                {...field}
                label='Featured Image Description'
                fullWidth
                error={!!errors.featured_image_description}
                helperText={errors.featured_image_description?.message}
                margin='normal'
              />
            )}
          />
          <Controller
            name='featured_image_credit'
            control={control}
            render={({ field }) => (
              <TextField
                size='small'
                {...field}
                label='Featured Image Credit'
                fullWidth
                error={!!errors.featured_image_credit}
                helperText={errors.featured_image_credit?.message}
                margin='normal'
              />
            )}
          />
        </Stack>

        <Stack flexDirection='row' gap={2}>
          <Controller
            name='meta_title'
            control={control}
            render={({ field }) => (
              <TextField
                size='small'
                {...field}
                label='Meta Title'
                fullWidth
                error={!!errors.meta_title}
                helperText={errors.meta_title?.message}
                margin='normal'
              />
            )}
          />
          <Controller
            name='meta_description'
            control={control}
            render={({ field }) => (
              <TextField
                size='small'
                {...field}
                label='Meta Description'
                fullWidth
                error={!!errors.meta_description}
                helperText={errors.meta_description?.message}
                margin='normal'
              />
            )}
          />
        </Stack>
        <Controller
          name='tags'
          control={control}
          render={({ field }) => (
            <Box mt={2} mb={1}>
              <FormControl fullWidth error={!!errors.tags} size='small'>
                <InputLabel id='tags-label'>Tags *</InputLabel>
                <Select
                  {...field}
                  size='small'
                  labelId='tags-label'
                  label={'Tags *'}
                  multiple
                  value={field.value.map(tag => tag)}
                >
                  {tags.map(tag => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>At least one tag is required</FormHelperText>
              </FormControl>
            </Box>
          )}
        />

        <Controller
          name='language'
          control={control}
          render={({ field }) => (
            <Box mt={2} mb={1}>
              <FormControl fullWidth error={!!errors.language} size='small'>
                <InputLabel id='language-label'>Language *</InputLabel>
                <Select
                  {...field}
                  label={'Language *'}
                  data-testid={'language-selector'}
                >
                  <MenuItem value='en'>English</MenuItem>
                  <MenuItem value='de'>German</MenuItem>
                  <MenuItem value='fr'>French</MenuItem>
                </Select>
                <FormHelperText>{errors.language?.message}</FormHelperText>
              </FormControl>
            </Box>
          )}
        />

        <Controller
          name='featured'
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.featured}>
              <FormControlLabel
                control={<Checkbox {...field} name='featured' />}
                label='Featured'
              />
              <FormHelperText>{errors.featured?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <input
          type={'hidden'}
          {...control.register('id')}
          value={defaultValues?.id ?? ''}
        />

        <SubmitButton setIsLoading={setIsLoading} />
      </Box>
    </>
  )
}

export default AddEditPost
