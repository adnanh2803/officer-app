import AssetTable from './components/AssetTable'
import AssetGroupTable from './components/AssetGroupTable'
import './AssetView.scss'
import { useEffect, useState } from 'react'

function AssetView() {
    const [assetGroupRow, setAssetGroupRow] = useState(-1)
    return (
        <div className='AssetView'>
            <div className='asset-table'>
                <AssetTable assetGroupRow={assetGroupRow}></AssetTable>
            </div>
            <div className='asset-table'>
                <AssetGroupTable></AssetGroupTable>
            </div>
        </div>

    )
}

export default AssetView