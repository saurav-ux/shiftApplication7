import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'
export const shiftApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://sauravshift.vercel.app/'
        // baseUrl:'http://localhost:5007'
    }),
    reducerPath:'shiftApi',
    endpoints:(builder)=>({
        getshiftData: builder.query({
            query:()=>({
                url:'/shift',
                method:'GET',
            })
        }),
        addShiftData:builder.mutation({
            query:(data)=>({
              url: '/shift',
              method: 'POST',
              body:data
            })
          }),
        deleteShiftData:builder.mutation({
            query:(id)=>({
              url: `/shift/${id}`,
              method: 'DELETE',
            })
          }),
    })
})

export const {useGetshiftDataQuery,useAddShiftDataMutation,useDeleteShiftDataMutation} = shiftApi
