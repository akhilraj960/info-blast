import React from 'react'
import { Button } from './ui/button'

interface Props {
    state: any,
    fetchDataFn: any
}

export const LoadMoreData = ({ state, fetchDataFn }: Props) => {

    if (state == null || state.totalDocs <= state.results.length) {
        return null
    }

    return (
        <Button>
            load more
        </Button>
    )
}
